import {useUser} from "@clerk/clerk-expo"
import {Redirect} from "expo-router"
import {Stack} from "expo-router/stack"

const Layout = ()=>{
    const {isSignedIn} = useUser()
    if(!isSignedIn) return <Redirect href={"/sign-in"} />
    return <Stack screenOptions={{headerShown:false}} />
}

export default Layout;