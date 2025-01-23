import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    Image,
    Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { appwriteConfig, databases, uploadFile } from "../lib/appwrite";
import { AntDesign } from "@expo/vector-icons";
// import { Video } from 'expo-av';

const SubmitSolutionScreen = ({ route, navigation }) => {
    const { projectId } = route.params;
    const [files, setFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);

    const handleSubmit = async () => {
        if (files.length === 0) {
            Alert.alert("No files", "Please upload at least one file before submitting.");
            return;
        }

        try {
            const jobDoc = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.jobCollectionID,
                projectId
            );

            const uploadedURLs = await Promise.all(
                files.map(async (uri) => {
                    try {
                        const fileResponse = await uploadFile({ uri: uri }, "");
                        return fileResponse;
                    } catch (err) {
                        Alert.alert("error", "Upload Error", `Failed to upload: ${err.message}`);
                        return null;
                    }
                })
            );

            const updatedSolutions = jobDoc?.solutions
                ? [...jobDoc.solutions, ...uploadedURLs]
                : uploadedURLs;

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.jobCollectionID,
                projectId,
                { solutions: updatedSolutions }
            );

            Alert.alert("Success", "Your solutions have been submitted.");
            navigation.goBack();
        } catch (err) {
            console.log(err);
            
            Alert.alert("Error", "Failed to submit solutions. Please try again.");
        }
    };

    const renderPreview = (file) => {
        const fileType = file.name.split(".").pop().toLowerCase();
        const fileUrl = file.url;

        switch (fileType) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return <Image source={{ uri: fileUrl }} style={styles.previewImage} />;
            // case "mp4":
            // case "mov":
            // case "avi":
            //     return (
            //         <Video
            //             source={{ uri: fileUrl }}
            //             style={styles.previewVideo}
            //             useNativeControls
            //             resizeMode="contain"
            //             shouldPlay
            //         />
            //     );
            case "pdf":
                return (
                    <WebView
                        source={{ uri: fileUrl }}
                        style={styles.previewPDF}
                        originWhitelist={["*"]}
                    />
                );
            case "txt":
                return (
                    <WebView
                        source={{ html: `<pre>${fileUrl}</pre>` }}
                        style={styles.previewText}
                    />
                );
            default:
                return (
                    <Text style={styles.unsupportedText}>
                        Preview not available for this file type.
                    </Text>
                );
        }
    };

    const addFile = (fileData) => {
        const fileExists = files.some((file) => file.name === fileData.name);
        if (fileExists) {
            Alert.alert("Duplicate File", "This file has already been uploaded.");
        } else {
            setFiles([...files, fileData]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Submit Solutions</Text>

            <View style={styles.uploadContainer}>
                <WebView
                    style={styles.uploadButtonWebView}
                    source={{
                        html: `
                        <input 
                            type="file" 
                            id="fileInput" 
                            onchange="(function() {
                                const file = this.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const fileUrl = reader.result;
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                        name: file.name,
                                        url: fileUrl
                                    }));
                                };
                                reader.readAsDataURL(file);
                            }).call(this)" 
                            style="display: none;"
                        />
                        <label for="fileInput" style="
                    display: inline-block;
                    padding: 45px 55px;
                    background-color: #4C0183;
                    color: white;
                    width: 80%;
                    border-radius: 25px;
                    text-align: center;
                    cursor: pointer;
                    font-size: 48px;
                    font-weight: bold;
                    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.17);
                    margin: 10px 40px
                ">
                            Upload File
                        </label> 
                    `,
                    }}
                    onMessage={(event) => {
                        try {
                            const fileData = JSON.parse(event.nativeEvent.data);
                            addFile(fileData);
                        } catch (err) {
                            console.error("Error parsing uploaded file data:", err);
                        }
                    }}
                />
            </View>

            <FlatList
                data={files}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.fileItem}
                        onPress={() => setPreviewFile(item)}
                    >
                        <Text style={styles.fileText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyListText}>No files uploaded yet.</Text>
                }
            />

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={!!previewFile}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setPreviewFile(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setPreviewFile(null)}>
                            <AntDesign name="arrowleft" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{ color: "#fff", fontSize: 18 }}>Solutions Preview</Text>
                    </View>
                    {previewFile && renderPreview(previewFile)}
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    uploadContainer: {
        flex: 0.2
    },
    webViewStyle: {
        height: 80,
        marginBottom: 20,
        backgroundColor: "transparent",
    },
    uploadButtonWebView: {

        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
    },
    fileItem: {
        backgroundColor: "#f1f1f1",
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    fileText: {
        color: "#333",
    },
    emptyListText: {
        textAlign: "center",
        color: "#6c757d",
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 15,
    },
    submitButton: {
        backgroundColor: '#00871E',
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        paddingVertical: 12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#B64928',
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    modalHeader: {
        width: "100%",
        paddingHorizontal: 25,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
        position: "absolute",
        zIndex: 999,
        top: 0,
        gap: 80
    },
    previewImage: {
        width: "100%",
        height: "100%",
        resizeMode: "center",
        // marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },

    previewPDF: {
        width: "90%",
        height: "60%",
    },
    previewVideo: {
        width: "90%",
        height: "60%",
    },
    previewText: {
        width: "90%",
        height: "60%",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
    },
    unsupportedText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
});

export default SubmitSolutionScreen;