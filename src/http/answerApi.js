import { $authHost, $host } from '.';

export const createAnswer = async (answer) => {
    try {
        console.log('Request payload:', answer);
        const { data } = await $authHost.post('/api/answer/create', answer);
        return data;
    } catch (error) {
        console.error('Error creating answer:', error);

        const errorMessage = error.response?.data?.message || 'An error occurred while creating the answer';

        if (error.response?.status === 409) {
            throw new Error("Названный документ уже существует");
        }

        throw new Error(errorMessage);
    }
};

export const fetchAnswers = async () => {
    try {
        const { data } = await $host.get('/api/answer');
        return data;
    } catch (error) {
        console.error('Error fetching answers:', error);
        throw error;
    } 
};

export const deleteAnswer = async (id) => {
    try {
        const { data } = await $authHost.delete(`/api/answer/${id}`);
        return data;
    } catch (error) {
        console.error('Error deleting answer:', error.response || error.message);
        throw new Error(error.response?.data?.message || 'Ошибка при удалении документа');
    }
};

export const swapCategoriesAndSubs = async (idA, idB) => {
    const { data } = await $authHost.put('api/answer/swapCategoriesAndSubs', { idA, idB });
    return data;
};

export const swapSubs = async ( subIdA, subIdB ) => {
    const { data } = await $authHost.put('api/answer/swapSubs', { subIdA, subIdB });
    return data;
};
