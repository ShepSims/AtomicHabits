import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

import Page from './TodayPage';
import StatsPage from './StatsPage';
import AsyncStorage from '@react-native-community/async-storage';
import Edit from './Edit';

const { width, height } = Dimensions.get('window');
export default function Main() {
	const [habits, setHabits] = useState([]);

	// Load habits when the component mounts
	useEffect(() => {
		const loadHabits = async () => {
			try {
				const storedHabits = await AsyncStorage.getItem('habits');
				if (storedHabits !== null) {
					setHabits(JSON.parse(storedHabits));
				}
			} catch (error) {
				// Handle errors here
			}
		};

		loadHabits();
	}, []);

	// Save habits to storage when they change
	useEffect(() => {
		const saveHabits = async () => {
			try {
				await AsyncStorage.setItem('habits', JSON.stringify(habits));
			} catch (error) {
				// Handle errors here
			}
		};

		saveHabits();
	}, [habits]);
	const [currentPage, setCurrentPage] = useState(0);
	const scrollViewRef = useRef();

	const handleScroll = (event) => {
		const scrollPosition = event.nativeEvent.contentOffset.x;
		const currentPageIndex = Math.round(scrollPosition / width);
		setCurrentPage(currentPageIndex);
	};

	const navigateToPage = (pageIndex) => {
		scrollViewRef.current.scrollTo({ x: pageIndex * width, animated: true });
		setCurrentPage(pageIndex);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : -250}
		>
			<>
				<ScrollView
					horizontal
					pagingEnabled
					onScroll={handleScroll}
					scrollEventThrottle={16}
					ref={scrollViewRef}
					style={{ flex: 1, height: height }}
					showsHorizontalScrollIndicator={false}
				>
					<Page habits={habits} setHabits={setHabits} />
					<StatsPage habits={habits} setHabits={setHabits} />
					{/* You can add a third page or repeat one of the existing ones */}
					<Edit habits={habits} setHabits={setHabits} />
				</ScrollView>
				<View style={styles.tabBar}>
					{[0, 1, 2].map((pageIndex) => (
						<TouchableOpacity
							key={pageIndex}
							style={[styles.tabItem, currentPage === pageIndex && styles.activeTab]}
							onPress={() => navigateToPage(pageIndex)}
						>
							<Text>{pageIndex == 0 ? 'Today' : pageIndex == 1 ? 'Stats' : 'Edit'}</Text>
						</TouchableOpacity>
					))}
				</View>
			</>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	// ... other styles ...
	tabBar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#eee',
		paddingVertical: 10,
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
	},
	activeTab: {
		paddingBottom: 4,
		borderBottomWidth: 2,
		borderBottomColor: 'black',
	},

	page: {
		height: height * 0.9,
		width: width,
		backgroundColor: '#fff',
		flexDirection: 'column',
	},
});
