import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function StatsPage({ habits, setHabits }) {
	function Habit({ title, currentStreak, longestStreak, total, missedDays, edit }) {
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
					<Text style={{ fontSize: 20, margin: 10 }}>{title}</Text>
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
						<Text onPress={() => edit({ missedDays: missedDays + 1 })} style={{ fontSize: 16, padding: 10, marginHorizontal: 10 }}>
							{missedDays ?? 0}
						</Text>
					</View>
				</View>
			</View>
		);
	}

	function editHabit(index, updateArray) {
		let newList = [...habits];
		newList[index] = { ...newList[index], ...updateArray };
		setHabits(newList);
		return true;
	}

	return (
		<ScrollView style={{ flex: 1, height: height - 50, marginTop: 50, width: width }}>
			<Text style={{ fontSize: 40, marginLeft: 15 }}>Historical</Text>
			<View
				style={{
					flexDirection: 'row',
					position: 'absolute',
					right: 40,
					top: 40,
					width: width * 0.48,
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
						missedDays={item.missedDays ?? 0}
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
