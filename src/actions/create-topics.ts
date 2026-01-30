'use server'

export const createTopics = async (formData:FormData) => {
    const name = formData.get('name');
    const description = formData.get('description');

    console.log(name,description);
}