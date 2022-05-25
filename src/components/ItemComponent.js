import React  from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function ItemComponent ({items}) {
    return (
      <View style={styles.itemsList}>
        {items.map((item, index) => {
          return (
            <View key={index}>
                
              <Text style={styles.itemtext}>{item.enter} {item.time}</Text>
            </View>
          );
        })}
      </View>
    );
 }

const styles = StyleSheet.create({
  itemsList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemtext: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:16,
    fontWeight:'700'
  }
});