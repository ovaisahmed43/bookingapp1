import React from 'react';
import {StatusBar, Text, useColorScheme, View} from 'react-native';

const Header = ({title}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{padding: 8}}>
        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#333'}}>
          {title}
        </Text>
      </View>
    </>
  );
};

export default Header;
