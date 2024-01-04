import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window');

const Edit = ({ habits, setHabits }) => {
	const [editedHabits, setEditedHabits] = useState([]);

	useEffect(() => {
		setEditedHabits(habits);
	}, [habits]);

	const handleSave = async () => {
		setHabits(editedHabits);
		await AsyncStorage.setItem('habits', JSON.stringify(editedHabits));
	};

	const updateField = (index, field, value) => {
		const newHabits = [...editedHabits];
		newHabits[index] = { ...newHabits[index], [field]: value ?? 0 };
		setEditedHabits(newHabits);
	};

	return (
		<View style={styles.container}>
			<ScrollView style={styles.container}>
				<Text style={{ fontSize: 40, marginLeft: 15, marginBottom: 15 }}>Edit</Text>

				{editedHabits.map((habit, index) => (
					<View key={index} style={styles.habitEditor}>
						<View style={styles.habitHeader}>
							<Text style={styles.habitTitle}>{habit.title}</Text>
							<View style={styles.statsContainer}>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexDirection: 'row' }}>
										<Text style={styles.statText}>Current</Text>
										<TextInput
											style={styles.input}
											defaultValue={habit.currentStreak ? habit.currentStreak.toString() : '0'}
											onChangeText={(text) => updateField(index, 'currentStreak', text)}
										/>
									</View>
									<View style={{ flexDirection: 'row' }}>
										<Text style={styles.statText}>Longest</Text>
										<TextInput
											style={styles.input}
											defaultValue={habit.longestStreak ? habit.longestStreak.toString() : '0'}
											onChangeText={(text) => updateField(index, 'longestStreak', text)}
										/>
									</View>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexDirection: 'row' }}>
										<Text style={styles.statText}>Total</Text>
										<TextInput
											style={styles.input}
											defaultValue={habit.total ? habit.total.toString() : '0'}
											onChangeText={(text) => updateField(index, 'total', text)}
										/>
									</View>
									<View style={{ flexDirection: 'row' }}>
										<Text style={styles.statText}>Missed</Text>
										<TextInput
											style={styles.input}
											defaultValue={habit.missed ? habit.missed.toString() : '0'}
											onChangeText={(text) => updateField(index, 'missed', text)}
										/>
									</View>
								</View>
							</View>
							<Text style={styles.label}>Last Checked Date:</Text>
							<TextInput
								style={styles.input}
								value={habit.lastCheckedDate}
								onChangeText={(text) => updateField(index, 'lastCheckedDate', text)}
							/>
						</View>
					</View>
				))}
				<View style={{ height: 70 }}></View>
			</ScrollView>
			<TouchableOpacity onPress={handleSave} style={styles.saveButton}>
				<Text style={styles.saveButtonText}>Save Changes</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width,
		marginTop: 25,
	},
	habitEditor: {
		marginBottom: 20,
		borderWidth: 1,
		paddingBottom: 10,
		borderRadius: 15,
		marginHorizontal: 15,
	},
	habitHeader: {
		// flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	habitTitle: {
		fontSize: 24,
		margin: 10,
		fontWeight: 'bold',
	},
	statsContainer: {
		flexDirection: 'column',
	},
	statText: {
		fontSize: 16,
		padding: 10,
		marginHorizontal: 10,
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 5,
		marginVertical: 5,
	},
	label: {
		fontWeight: 'bold',
		marginTop: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		padding: 8,
		borderRadius: 5,
		marginTop: 5,
		textAlign: 'center',
	},
	saveButton: {
		backgroundColor: 'blue',
		paddingHorizontal: 50,
		paddingVertical: 15,
		borderRadius: 50,
		alignItems: 'center',
		position: 'absolute',
		alignSelf: 'center',
		bottom: 25,
	},
	saveButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});

export default Edit;
