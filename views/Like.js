// components/LikeSection.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { addLike, deleteLike, getLikesByPublication, hasUserLiked } from '../services/LikeService';
import { UserContext } from './UserC';

export default function Like({ publicationId }) {
    const [likes, setLikes] = useState([]);
    const [userHasLiked, setUserHasLiked] = useState(false);
    const { user } = useContext(UserContext);
    const userId = user ? user.id : null;

    useEffect(() => {
        fetchLikes();
        if (userId) {
            checkIfUserLiked();
        }
    }, [publicationId, userId]);

    const fetchLikes = async () => {
        try {
            const data = await getLikesByPublication(publicationId);
            setLikes(data);
        } catch (err) {
            console.error('Erreur lors de la récupération des likes :', err.message);
        }
    };

    const checkIfUserLiked = async () => {
        if (userId) {
            try {
                const liked = await hasUserLiked(publicationId, userId);
                setUserHasLiked(liked);
            } catch (err) {
                console.error('Erreur lors de la vérification du like :', err.message);
            }
        }
    };

    const handleLike = async () => {
        if (!userId) {
            Alert.alert('Erreur', 'Utilisateur non connecté');
            return;
        }

        if (userHasLiked) {
            Alert.alert(
                'Confirmer la suppression',
                'Êtes-vous sûr de vouloir retirer votre like ?',
                [
                    {
                        text: 'Annuler',
                        style: 'cancel',
                    },
                    {
                        text: 'Retirer',
                        onPress: async () => {
                            try {
                                await deleteLike(userId);
                                fetchLikes();
                                setUserHasLiked(false);
                            } catch (err) {
                                console.error('Erreur lors de la suppression du like :', err.message);
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            const newLike = {
                publicationId,
                userId
            };

            try {
                await addLike(newLike);
                fetchLikes();
                setUserHasLiked(true);
            } catch (err) {
                console.error('Erreur lors de l\'ajout du like :', err.message);
            }
        }
    };

    return (
        <View style={styles.likeSection}>
            <Text>{likes.length} Likes</Text>
            <Button
                title={userHasLiked ? "Retirer Like" : "Ajouter Like"}
                onPress={handleLike}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    likeSection: {
        marginTop: 10,
        alignItems: 'center',
    },
});
