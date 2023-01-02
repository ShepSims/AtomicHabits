import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const Page1 = () => (
	<View style={{ flex: 1, backgroundColor: 'red', width: width }}>
		<Text>Page 1</Text>
	</View>
);

const Page2 = () => <View style={{ flex: 1, backgroundColor: 'green', width: width }}></View>;

const Page3 = () => (
	<View style={{ flex: 1, backgroundColor: 'blue', width: width }}>
		<Text>Page 3</Text>
	</View>
);

const HorizontalScrollView = () => (
	<ScrollView horizontal pagingEnabled style={{ flex: 1 }}>
		<Page1 />
		<Page2 />
		<Page3 />
	</ScrollView>
);

const styles = StyleSheet.create({
	page: {
		height: height * 0.9,
		width: width,
		backgroundColor: '#fff',
		flexDirection: 'column',
	},
});

export default HorizontalScrollView;
