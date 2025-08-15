import { Button } from '@/components/core/ui/button';
import { Alert, Text, View } from 'react-native';

export default function HomePage() {
  return (
    <View>
      <Text>Welcome to the Home Page!</Text>
      <Button onPress={() => Alert.alert('Button Pressed!')}>
        <Text>Press Me</Text>
      </Button>
    </View>
  );
}
