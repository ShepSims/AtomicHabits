import { StatusBar } from 'expo-status-bar';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Main from './Main';

const { height, width } = Dimensions.get('window');

export default function App() {
	return (
		<View style={styles.container}>
			<Main />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	home: {
		flex: 1,
		backgroundColor: '#fff',
	},
	page: {
		height: height * 0.9,
		width: width,
		backgroundColor: '#fff',
		flexDirection: 'column',
	},
});
