import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function Page({ habits, setHabits }) {
	function Habit({ title, isChecked, pop }) {
		const [checked, setChecked] = useState(isChecked);
		return (
			<View
				style={{
					flex: 1,
					width: width,
				}}
			>
				<View
					style={{
						alignItems: 'center',
						marginTop: 10,
						flexDirection: 'row',
						borderWidth: 2,
						width: width - 30,
						marginLeft: 15,
					}}
				>
					<Text style={{ fontSize: 20, margin: 10 }}>{title}</Text>
					<Checkbox color={'black'} style={styles.checkbox} value={checked} onValueChange={setChecked} />
					<TouchableOpacity style={styles.confirm} onPress={pop}>
						<Image source={require('./trash.png')} style={{ resizeMode: 'contain', height: 35, width: 35 }}></Image>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	function addHabit(title, checked) {
		let newList = [...habits];
		newList.push({ title: title, checked: checked });
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
						value={title}
						placeholder='Add New Habit'
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

	return (
		<ScrollView style={{ flex: 1, height: height - 50, marginTop: 50 }}>
			<Text style={{ fontSize: 40, marginLeft: 15 }}>Today</Text>
			{habits.map((item, index) => {
				return <Habit title={item.title} checked={item.checked} pop={() => popHabit(index)}></Habit>;
			})}
			<NewHabit></NewHabit>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	checkbox: {
		position: 'absolute',
		borderWidth: 1,
		right: 40,
	},
	confirm: {
		position: 'absolute',
		right: 0,
	},
});
