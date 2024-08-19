import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, Button } from 'react-native';
import { deletePublication, getPublicationsByUserId } from '../services/PublicationService';
import { UserContext } from './UserC';
import { Menu, Divider, IconButton } from 'react-native-paper';
import CommentSection from './Comment';

export default function ProfileScreen({ navigation }) {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPublicationId, setExpandedPublicationId] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(null);

    const { user } = useContext(UserContext);
    const userId = user ? user.id : null;

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const publicationsResponse = await getPublicationsByUserId(userId);
            if (Array.isArray(publicationsResponse)) {
                setPublications(publicationsResponse);
            } else {
                throw new Error('Réponse de l\'API invalide');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
                <Button title="Réessayer" onPress={fetchData} />
            </View>
        );
    }

    const handleDeletePublication = async (publicationId) => {
        Alert.alert(
            'Confirmer la suppression',
            'Êtes-vous sûr de vouloir supprimer cette publication ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    onPress: async () => {
                        try {
                            await deletePublication(publicationId);
                            setPublications(prev => prev.filter(pub => pub._id !== publicationId));
                        } catch (err) {
                            console.error('Erreur lors de la suppression de la publication :', err.message);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleExpandComments = (publicationId) => {
        setExpandedPublicationId(expandedPublicationId === publicationId ? null : publicationId);
    };

    const renderPublication = ({ item }) => {
        if (!item || !item._id) {
            return null; // Évitez d'afficher des éléments invalides
        }

        return (
            <View style={styles.publicationCard}>
                <View style={styles.cardHeader}>
                    {item.userId && item.userId.image ? (
                        <Image 
                            source={{ uri: item.userId.image.replace('127.0.0.1', '192.168.1.21') }} 
                            style={styles.userImage} 
                        />
                    ) : (
                        <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.userImage} />
                    )}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.userId ? item.userId.fullName : 'Utilisateur inconnu'}</Text>
                        <Text style={styles.publicationDate}>{new Date(item.datePub).toLocaleDateString()}</Text>
                    </View>
                </View>
                {item.image ? (
                    <Image 
                        source={{ uri: item.image.replace('127.0.0.1', '192.168.1.21') }} 
                        style={styles.publicationImage}
                        onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
                    />
                ) : (
                    <Text style={styles.noImageText}>Aucune image disponible</Text>
                )}
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.interactionRow}>
                    <TouchableOpacity style={styles.likeButton}>
                        <Text style={styles.likeText}>J'aime</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.commentButton}
                        onPress={() => handleExpandComments(item._id)}
                    >
                        <Text style={styles.commentText}>Commenter</Text>
                    </TouchableOpacity>

                    {user && user.id === item.userId._id && (
                        <Menu
                            visible={visibleMenu === item._id}
                            onDismiss={() => setVisibleMenu(null)}
                            anchor={<IconButton icon="dots-vertical" size={20} onPress={() => setVisibleMenu(item._id)} />}
                        >
                            <Menu.Item onPress={() => { setVisibleMenu(null); navigation.navigate('UpdatePublication', { publicationId: item._id }); }} title="Modifier" />
                            <Divider />
                            <Menu.Item onPress={() => { setVisibleMenu(null); handleDeletePublication(item._id); }} title="Supprimer" />
                        </Menu>
                    )}
                </View>

                <CommentSection
                    publicationId={item._id}
                    expandedPublicationId={expandedPublicationId}
                    handleExpandComments={() => handleExpandComments(item._id)}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={publications}
                keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
                renderItem={renderPublication}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    publicationCard: {
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
    },
    publicationDate: {
        color: 'grey',
    },
    publicationImage: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    noImageText: {
        color: 'grey',
    },
    description: {
        marginBottom: 10,
    },
    interactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeText: {
        marginLeft: 5,
    },
    commentButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentText: {
        marginLeft: 5,
    },
});
