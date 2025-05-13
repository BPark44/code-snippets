import { AppleIcon, GoogleIcon, MailIcon } from "@/components/icons";
import Button from "@/components/ui/Button";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, Text, TextInput, View } from "react-native";

export default function AuthScreen() {
    const screenHeight = Dimensions.get("window").height;

    const [showEmailInputs, setShowEmailInputs] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View className="flex-1 bg-white">
            <Image
                // Note: You will need your own image here
                source={require("@/assets/images/auth_bg.png")}
                style={{
                    width: "100%",
                    height: screenHeight * 0.8,
                    position: "absolute",
                    top: 0,
                }}
                resizeMode="cover"
            />

            <LinearGradient
                colors={["transparent", "white"]}
                style={{
                    position: "absolute",
                    bottom: screenHeight * 0.2,
                    left: 0,
                    right: 0,
                    height: 350,
                }}
            />

            <View className="flex-col gap-4 mt-auto mb-10 px-4">
                <Text className="text-center text-black text-[24px] font-bold mb-2">
                    Login
                </Text>

                {!showEmailInputs ? (
                    <View className="flex-col gap-6">
                        <Button
                            icon={<MailIcon />}
                            onPress={() => setShowEmailInputs(true)}
                        >
                            Continue with Email
                        </Button>

                        <Button
                            icon={<GoogleIcon />}
                            onPress={() => router.push("/signin")}
                        >
                            Continue With Google
                        </Button>

                        <Button
                            icon={<AppleIcon />}
                            onPress={() => router.push("/signin")}
                        >
                            Continue With Apple
                        </Button>

                        <Text className="text-center text-gray-500">
                            Dont have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-bold text-[#4B5119]"
                            >
                                Create Account
                            </Link>
                        </Text>
                    </View>
                ) : (
                    <View className="flex-col gap-6">
                        <TextInput
                            className="h-14 border border-gray-300 rounded-full px-6 bg-white placeholder:text-gray-500"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            secureTextEntry={false}
                        />

                        <TextInput
                            className="h-14 border border-gray-300 rounded-full px-6 bg-white placeholder:text-gray-500"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Button onPress={() => setShowEmailInputs(false)}>
                            Sign In
                        </Button>

                        <Button
                            variant="secondary"
                            onPress={() => setShowEmailInputs(false)}
                        >
                            Back
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
}
