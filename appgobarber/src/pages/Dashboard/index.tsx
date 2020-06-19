import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { logOut } = useAuth();

  return (
    <View>
      <Button title="Sair" onPress={logOut} />
    </View>
  );
};

export default Dashboard;
