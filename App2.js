import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';
import { db } from './firebaseConfig'; // Import your Firebase configuration
import CustomCheckbox from './Checkbox';

const HabitItem = ({ habit, habitId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState(habit.name);

	const deleteHabit = () => {
		const habitRef = ref(db, 'habits/' + habitId);
		remove(habitRef);
	};

	const startEditing = () => {
		setIsEditing(true);
	};

	const saveEdit = () => {
		const habitRef = ref(db, 'habits/' + habitId);
		update(habitRef, { name: editedName });
		setIsEditing(false);
	};

	const handleToggleCheckbox = () => {
		const habitRef = ref(db, 'habits/' + habitId);
		update(habitRef, { completed: !habit.completed });
	};
	return (
		<View style={styles.habitItem}>
			<CustomCheckbox isChecked={habit.completed} onToggle={handleToggleCheckbox} />

			{isEditing ? (
				<TextInput value={editedName} onChangeText={setEditedName} style={styles.textInput} />
			) : (
				<Text style={styles.habitText}>{habit.name}</Text>
			)}
			{isEditing ? (
				<TouchableOpacity onPress={saveEdit} style={styles.button}>
					<Text style={styles.buttonText}>Save</Text>
				</TouchableOpacity>
			) : (
				<>
					<TouchableOpacity onPress={startEditing} style={styles.button}>
						<Text style={styles.buttonText}>Edit</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={deleteHabit} style={styles.button}>
						<Text style={styles.buttonText}>Delete</Text>
					</TouchableOpacity>
				</>
			)}
		</View>
	);
};

const AddHabit = () => {
	const [newHabitName, setNewHabitName] = useState('');

	const addHabit = () => {
		const habitsRef = ref(db, 'habits');
		push(habitsRef, { name: newHabitName, completed: false });
		setNewHabitName('');
	};

	return (
		<View style={{ paddingTop: 40, paddingHorizontal: 20 }}>
			<TextInput
				value={newHabitName}
				onChangeText={setNewHabitName}
				placeholder='New Habit Name'
				style={styles.textInput}
				placeholderTextColor={'white'}
			/>
			<TouchableOpacity onPress={addHabit} style={styles.button}>
				<Text style={styles.buttonText}>Add Habit</Text>
			</TouchableOpacity>
		</View>
	);
};

const HabitList = () => {
	const [habits, setHabits] = useState([]);

	useEffect(() => {
		const habitsRef = ref(db, 'habits');
		onValue(habitsRef, (snapshot) => {
			console.log('Habit', snapshot);
			const data = snapshot.val();
			const habitList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
			setHabits(habitList);
		});

		return () => {
			// Unsubscribe from the listener when the component unmounts
		};
	}, []);

	return <FlatList data={habits} renderItem={({ item }) => <HabitItem habit={item} habitId={item.id} />} keyExtractor={(item) => item.id} />;
};

const App = () => {
	return (
		<View style={styles.container}>
			<AddHabit />
			<HabitList />
		</View>
	);
};

const styles = {
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: 'black',
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#ddd',
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
		color: 'white',
	},
	button: {
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'white',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	habitItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderColor: '#ddd',
	},
	habitText: {
		flex: 1,
		fontSize: 16,
		color: 'white',
	},
	// Add other styles as needed
};

export default App;
