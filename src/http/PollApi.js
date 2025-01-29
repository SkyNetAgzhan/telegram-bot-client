import { $authHost, $host } from ".";

export const createPoll = async (poll) => {
  try {
    const { data } = await $authHost.post('/api/poll/create', poll);
    return data;
  }catch (error){
    console.error('Error creating poll:', error);
    throw error;
  }
};

export const fetchPolls = async () => {
  try {
    const { data } = await $host.get('/api/poll');
    return data;
  } catch (error){
    console.error('Error fetching polls: ', error);
    throw error;
  }
};

export const votePoll = async (pollId, optionId) => {
  try {
    const { data } = await $authHost.post('/api/poll/vote', { pollId, optionId });
    return data;
  }catch (error){
    console.error('Error voting on poll:', error);
    throw error;
  }
};

export const fetchPollsResults = async (pollId) => {
  try {
    const { data } = await $host.get(`/api/poll/${pollId}/results`);
    return data;
  } catch (error){
    console.error('Error fetching poll results: ', error);
    throw error;
  }
};

export const deletePoll = async (pollId) => {
  try{
    const { data } = await $authHost.delete(`/api/poll/${pollId}`);
    return data;
  } catch ( error ){
    console.error('Error deleting poll:', error);
    throw error;
  }
};