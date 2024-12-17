import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useAuth } from "../context/AuthContext";

const ReviewScreen = ({navigation}) => {
    const [ratings, setRatings] = useState({
        experience: 0,
        knowledge: 0,
        response: 0,
    });

    const { userData } = useAuth()

    const [reviewText, setReviewText] = useState("");

    const handleStarPress = (category, index) => {
        setRatings({ ...ratings, [category]: index });
    };

    const updateFreelancerXP = async (freelancerId, baseXP, starRating) => {
        try {

            const freelancer = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.freelancerCollectionId,
                freelancerId
            );

            const earnedXP = Math.round(baseXP + (starRating * 9));

            const updatedXP = freelancer.XP + earnedXP;

            const currentRating = freelancer.rating || 0;
            const completedJobs = freelancer.completedJobs || 0;
            const updatedCompletedJobs = completedJobs + 1;

            const updatedRating = ((currentRating * completedJobs) + starRating) / updatedCompletedJobs;

            const level = calculateLevel(updatedXP);

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.freelancerCollectionId,
                freelancerId,
                {
                    XP: updatedXP,
                    level: level,
                    rating: parseFloat(updatedRating.toFixed(1)),
                }
            );

        } catch (error) {
            console.error('Error updating freelancer XP and level:', error);
        }
    }

    const calculateLevel = (totalXP) => {
        const baseXP = 100;
        const incrementXP = 100;

        let level = 1;
        let xpForNextLevel = baseXP;

        while (totalXP >= xpForNextLevel) {
            level += 1;
            totalXP -= xpForNextLevel;
            xpForNextLevel += incrementXP;
        }

        return level;
    }

    const handleSubmit = async () => {
        const freelancerId = userData.$id
        const { experience, knowledge, response } = ratings;
        const baseXP = 30
        const averageRating = ((experience + knowledge + response) / 3).toFixed(2);
        await updateFreelancerXP(freelancerId, baseXP, averageRating);
        // navigation.getParent()?.reset({
        //     index: 1,
        //     routes: [{ name: "Home" }],
        //   });

        navigation.navigate("Home")
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Review this job</Text>

            {/* Overall Working Experience */}
            <Text style={styles.label}>Overall Working Experience</Text>
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleStarPress("experience", index)}
                    >
                        <MaterialIcons
                            name="star"
                            size={36}
                            color={index <= ratings.experience ? "#4B0082" : "#D9D9D9"}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Project Knowledge */}
            <Text style={styles.label}>Project Knowledge</Text>
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleStarPress("knowledge", index)}
                    >
                        <MaterialIcons
                            name="star"
                            size={36}
                            color={index <= ratings.knowledge ? "#4B0082" : "#D9D9D9"}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Response Time */}
            <Text style={styles.label}>Response Time</Text>
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleStarPress("response", index)}
                    >
                        <MaterialIcons
                            name="star"
                            size={36}
                            color={index <= ratings.response ? "#4B0082" : "#D9D9D9"}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Write a Review */}
            <Text style={styles.subHeading}>Write a review</Text>
            <TextInput
                style={styles.textInput}
                multiline
                placeholder="How was the experience..."
                placeholderTextColor="#aaa"
                value={reviewText}
                onChangeText={setReviewText}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 20,
        alignItems: "center",
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#4B0082",
        marginBottom: 10,
        marginTop: 25
    },
    label: {
        fontSize: 15,
        fontWeight: "500",
        color: "#555",
        marginTop: 24,
    },
    starContainer: {
        flexDirection: "row",
        marginVertical: 5,
        gap: 18
    },
    subHeading: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#4B0082",
        marginTop: 40,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        width: "100%",
        minHeight: 140,
        padding: 10,
        marginVertical: 10,
        textAlignVertical: "top",
        color: "#000",
    },
    submitButton: {
        backgroundColor: "#4B0082",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginTop: 10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default ReviewScreen;
