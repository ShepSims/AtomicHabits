import AsyncStorage from '@react-native-community/async-storage';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { ref, set } from 'firebase/database';
import { db } from './firebaseConfig';

const { width, height } = Dimensions.get('window');

export default function TodayPage({ habits, setHabits }) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [resetSummary, setResetSummary] = useState([]);

	const setLastCheckedDateToThreeDaysAgo = async () => {
		if (habits.length > 0) {
			const updatedHabits = [...habits];
			const threeDaysAgo = new Date();
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

			updatedHabits[0] = {
				...updatedHabits[0],
				lastCheckedDate: threeDaysAgo.toDateString(),
			};

			setHabits(updatedHabits);
			await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
		}
	};

	const setLastResetDateToPast = async (daysAgo) => {
		const pastDate = new Date();
		pastDate.setDate(pastDate.getDate() - daysAgo);
		const pastDateString = pastDate.toDateString();

		await AsyncStorage.setItem('lastResetDate', pastDateString);
		console.log(`lastResetDate set to ${pastDateString} for testing.`);
	};

	const resetHabitsIfNeeded = async (storedHabits) => {
		const today = new Date();
		const todayString = today.toDateString();
		const lastResetDate = (await AsyncStorage.getItem('lastResetDate')) || todayString;

		if (todayString !== lastResetDate && Array.isArray(storedHabits)) {
			const resetHabits = storedHabits.map((habit) => {
				const lastCheckedDate = new Date(habit.lastCheckedDate || lastResetDate);
				const daysMissed = calculateDaysBetweenDates(lastCheckedDate, today);

				// Increment 'missed' by the number of days missed
				const missed = habit.checked ? habit.missed : habit.missed + daysMissed;

				return { ...habit, checked: false, missed, lastCheckedDate: todayString };
			});

			const summary = resetHabits.map((habit) => {
				return {
					title: habit.title,
					missedChange: habit.missed - (storedHabits.find((h) => h.title === habit.title)?.missed || 0),
					currentStreak: habit.currentStreak,
				};
			});

			setResetSummary(summary);
			setIsModalVisible(true);

			setHabits(resetHabits);
			await AsyncStorage.setItem('habits', JSON.stringify(resetHabits));
			await AsyncStorage.setItem('lastResetDate', todayString);
		}
	};

	const calculateDaysBetweenDates = (startDate, endDate) => {
		const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
		return Math.round(Math.abs((endDate - startDate) / oneDay));
	};

	useEffect(() => {
		const loadHabits = async () => {
			try {
				const storedHabitsString = await AsyncStorage.getItem('habits');
				const storedHabits = storedHabitsString ? JSON.parse(storedHabitsString) : [];
				console.log('Loaded habits:', storedHabits);
				resetHabitsIfNeeded(storedHabits);
			} catch (error) {
				console.error('Error retrieving habits from AsyncStorage:', error);
			}
		};

		loadHabits();
	}, []);

	const yesterdayDateString = () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return yesterday.toDateString();
	};

	const handleCheckHabit = async (index) => {
		const newCheckedValue = !habits[index].checked;

		// Update the state and then AsyncStorage
		setHabits((prevHabits) => {
			const updatedHabits = prevHabits.map((habit, i) => (i === index ? { ...habit, checked: newCheckedValue } : habit));

			// Update AsyncStorage after state is updated
			AsyncStorage.setItem('habits', JSON.stringify(updatedHabits)).catch((error) => {
				console.error('Error saving data', error);
			});

			// Update stats based on the new checked value
			updateStats(updatedHabits, index, newCheckedValue);

			return updatedHabits;
		});
	};

	const updateStats = (updatedHabits, index, isChecked) => {
		let habit = updatedHabits[index];

		// Check if the habit exists
		if (!habit) {
			console.error('Habit not found');
			return;
		}

		const today = new Date().toDateString();
		const lastCheckedDate = habit.lastCheckedDate || '';

		let { currentStreak, longestStreak, total } = habit;

		if (isChecked) {
			if (lastCheckedDate === yesterdayDateString()) {
				currentStreak += 1;
			} else {
				currentStreak = 1;
			}
			total += 1;
		} else {
			if (lastCheckedDate === today) {
				currentStreak = currentStreak > 0 ? currentStreak - 1 : 0;
				total = total > 0 ? total - 1 : 0;
			}
		}

		longestStreak = Math.max(longestStreak, currentStreak);

		const updatedHabit = {
			...habit,
			currentStreak,
			longestStreak,
			total,
			lastCheckedDate: isChecked ? today : habit.lastCheckedDate,
		};

		updatedHabits[index] = updatedHabit;
		setHabits(updatedHabits);
		AsyncStorage.setItem('habits', JSON.stringify(updatedHabits)).catch((error) => {
			console.error('Error saving data', error);
		});
	};

	function Habit({ title, checked, lastCheckedDate, currentStreak, longestStreak, missed, pop, onCheckedChange }) {
		const [checkedState, setCheckedState] = useState(checked);

		useEffect(() => {
			setCheckedState(checked);
		}, [checked]);

		const handleCheckedChange = (newChecked) => {
			setCheckedState(newChecked);
			onCheckedChange(newChecked);
		};

		const formatDateToDaysAgo = (dateString) => {
			if (!dateString) return 'N/A';

			const date = new Date(dateString);
			const today = new Date();
			const differenceInTime = today.getTime() - date.getTime();
			const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

			if (differenceInDays === 0) {
				return 'Today';
			} else if (differenceInDays === 1) {
				return '1 day ago';
			} else {
				return `${differenceInDays} days ago`;
			}
		};

		return (
			<View style={styles.habitContainer}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Checkbox color={'black'} style={styles.checkbox} value={checkedState} onValueChange={handleCheckedChange} />
						<Text style={styles.habitTitle}>{title}</Text>
					</View>
					<TouchableOpacity style={styles.delete} onPress={pop}>
						<Image source={require('./trash.png')} style={{ resizeMode: 'contain', height: 35, width: 35 }} />
					</TouchableOpacity>
				</View>
				<View style={styles.habitDetails}>
					<Text>Last Checked: {formatDateToDaysAgo(lastCheckedDate)}</Text>
					<Text>Current Streak: {currentStreak}</Text>
				</View>
			</View>
		);
	}

	async function addHabit(title, checked) {
		let newList = [...habits];
		newList.push({ title: title, checked: checked, total: 0, longestStreak: 0, currentStreak: 0, missed: 0, lastCheckedDate: null });
		try {
			let list = JSON.stringify(newList);
			await AsyncStorage.setItem('habits', list);
		} catch (error) {
			// Error saving data
		}
		try {
			const myArray = await AsyncStorage.getItem('habits');
			console.log('array is now', JSON.parse(myArray));
			if (myArray !== null) {
				// We have data!!
			}
		} catch (error) {
			// Error retrieving data
		}
		setHabits(newList);
		return true;
	}

	function popHabit(index) {
		let newList = [...habits];
		newList.splice(index, 1);
		setHabits(newList);
		return true;
	}

	function NewHabit({}) {
		const [title, onChangeNumber] = useState(null);
		const [checked, onChangeChecked] = useState(false);

		return (
			<View
				style={{
					flex: 1,
					width: width,
					paddingBottom: 75,
				}}
			>
				<View
					style={{
						alignItems: 'center',
						marginTop: 10,
						flexDirection: 'row',
						justifyContent: 'space-around',
						borderWidth: 2,
						width: width - 30,
						height: 50,
						marginLeft: 15,
					}}
				>
					<TextInput
						style={{
							flex: 1,
							marginLeft: 20,
							fontSize: 20,
						}}
						onChangeText={onChangeNumber}
						onSubmitEditing={() => addHabit(title, checked)}
						value={title}
						placeholder='+Add New Challenge'
					/>
					{/* <Checkbox color={'black'} style={styles.checkbox} value={checked} onValueChange={onChangeChecked} /> */}
					<TouchableOpacity style={styles.confirm} onPress={() => addHabit(title, checked)}>
						<Image
							source={require('./check.png')}
							height={35}
							width={35}
							style={{ resizeMode: 'contain', height: 35, width: 35 }}
						></Image>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	const ResetModal = ({ isVisible, summary, onClose }) => {
		return (
			<Modal animationType='slide' transparent={true} visible={isVisible} onRequestClose={onClose}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Reset Summary</Text>
						{summary.map((item, index) => (
							<Text key={index} style={styles.modalItemText}>
								{item.title}: Missed +{item.missedChange}, Current Streak: {item.currentStreak}
							</Text>
						))}
						<TouchableOpacity style={styles.buttonClose} onPress={onClose}>
							<Text style={styles.textStyle}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		);
	};

	return (
		<ScrollView style={{ flex: 1, height: height - 50, marginTop: 50, backgroundColor: 'rgb(230,230,230)' }}>
			<Text style={{ fontSize: 40, marginLeft: 15, fontWeight: '500' }}>75 Hard</Text>
			{habits.map((item, index) => {
				return (
					<Habit
						key={index}
						title={item.title}
						checked={item.checked}
						pop={() => popHabit(index)}
						isChecked={item.checked}
						lastCheckedDate={item.lastCheckedDate}
						currentStreak={item.currentStreak}
						onCheckedChange={(newChecked) => handleCheckHabit(index, newChecked)}
					></Habit>
				);
			})}
			<TouchableOpacity onPress={setLastCheckedDateToThreeDaysAgo} style={styles.testButton}>
				<Text>Set Last Checked Date to 3 Days Ago</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => setLastResetDateToPast(3)} style={styles.testButton}>
				<Text>Set Last Reset Date to 3 Days Ago</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					set(ref(db, 'users/'), {
						username: 'test',
					});
				}}
				style={styles.testButton}
			>
				<Text>Test push to db</Text>
			</TouchableOpacity>
			<NewHabit></NewHabit>
			<ResetModal isVisible={isModalVisible} summary={resetSummary} onClose={() => setIsModalVisible(false)} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	testButton: {
		backgroundColor: 'lightblue',
		padding: 10,
		margin: 10,
		alignItems: 'center',
	},
	habitContainer: {
		flex: 1,
		padding: 10,
		borderWidth: 1,
		margin: 10,
		backgroundColor: '#f9f9f9',
		borderRadius: 5,
	},
	habitTitle: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	habitDetails: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
	},
	checkbox: {
		marginHorizontal: 10,
	},
	confirm: {
		marginLeft: 10,
	},
	delete: {
		marginLeft: 10,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	modalItemText: {
		textAlign: 'center',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
