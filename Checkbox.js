import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const CustomCheckbox = ({ isChecked, onToggle }) => {
	return (
		<TouchableOpacity style={styles.checkbox} onPress={onToggle}>
			{isChecked && <View style={styles.checkedView} />}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 25,
	},
	checkedView: {
		width: 12,
		height: 12,
		backgroundColor: 'blue',
	},
});

export default CustomCheckbox;
