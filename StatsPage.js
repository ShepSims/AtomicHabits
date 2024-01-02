import AsyncStorage from '@react-native-community/async-storage';
import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function StatsPage({ habits, setHabits }) {
	console.log('habis', habits);
	function Habit({ title, currentStreak, longestStreak, total, missed, checked, edit }) {
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
						marginTop: 25,
						flexDirection: 'row',
						borderWidth: 2,
						width: width - 30,
						marginLeft: 15,
					}}
				>
					<Checkbox color={'black'} style={{ margin: 3, position: 'absolute', top: 0, right: 0, height: 10, width: 10 }} value={checked} />

					<Text style={{ fontSize: 16, margin: 10 }}>{title}</Text>
					<View
						style={{
							flexDirection: 'row',
							position: 'absolute',
							right: 40,
							width: width * 0.4,
							justifyContent: 'center',
						}}
					>
						<Text onPress={() => edit({ currentStreak: currentStreak + 1 })} style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>
							{currentStreak ?? 0}
						</Text>
						<Text onPress={() => edit({ longestStreak: longestStreak + 1 })} style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>
							{longestStreak ?? 0}
						</Text>
						<Text onPress={() => edit({ total: total + 1 })} style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>
							{total ?? '0s'}
						</Text>
						<Text onPress={() => edit({ missed: missed + 1 })} style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>
							{missed ?? 0}
						</Text>
					</View>
				</View>
			</View>
		);
	}

	function editHabit(index, updateArray) {
		let newList = [...habits];
		newList[index] = { ...newList[index], ...updateArray };

		// Update the state and AsyncStorage
		setHabits(newList);
		AsyncStorage.setItem('habits', JSON.stringify(newList)).catch((error) => {
			console.error('Error saving data', error);
		});
	}
	return (
		<ScrollView style={{ flex: 1, height: height - 50, marginTop: 50, width: width }}>
			<Text style={{ fontSize: 40, marginLeft: 15 }}>Progress</Text>
			<View
				style={{
					flexDirection: 'row',
					position: 'absolute',
					right: 40,
					top: 40,
					width: width * 0.5,
					justifyContent: 'space-evenly',
				}}
			>
				<Text style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>current</Text>
				<Text style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>longest</Text>
				<Text style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>total</Text>
				<Text style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>missed</Text>
			</View>

			{habits.map((item, index) => {
				return (
					<Habit
						title={item.title}
						currentStreak={item.currentStreak ?? 0}
						longestStreak={item.longestStreak ?? 0}
						total={item.total ?? 0}
						missed={item.missed ?? 0}
						checked={item.checked}
						edit={(update) => editHabit(index, update)}
					></Habit>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	checkbox: {
		position: 'absolute',
		borderWidth: 1,
		right: 15,
	},
});
