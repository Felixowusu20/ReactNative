import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import SafeScreen from "@/components/SafeScreen" //the safescreen component was created to put the entire app  from improper rendering

export default function RootLayout() {
  return(
    <ClerkProvider tokenCache={tokenCache}>
          <SafeScreen>
            <Slot />
          </SafeScreen>
    </ClerkProvider>    
  );
}



