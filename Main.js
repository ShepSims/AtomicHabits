import React, { useState } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import Page from './Page';
import StatsPage from './StatsPage';

const { width, height } = Dimensions.get('window');

export default function Main() {
	const [habits, setHabits] = useState([]);

	return (
		<ScrollView horizontal pagingEnabled style={{ flex: 1 }}>
			<Page habits={habits} setHabits={setHabits}></Page>
			<StatsPage habits={habits} setHabits={setHabits} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	page: {
		height: height * 0.9,
		width: width,
		backgroundColor: '#fff',
		flexDirection: 'column',
	},
});
