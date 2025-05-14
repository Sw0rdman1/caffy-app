import * as FileSystem from 'expo-file-system';

const CLARIFAI_API_KEY = '1c4c43d033804fe190563f2645056d7c';

const KEY_WORDS = ['coffee', 'espresso', 'cappuccino', 'latte', 'mocha', 'americano', 'macchiato', 'flat white'];

export async function checkImageForCoffee(imageUri: string): Promise<boolean> {
    try {
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const response = await fetch('https://api.clarifai.com/v2/models/general-image-recognition/outputs', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${CLARIFAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: [
                    {
                        data: {
                            image: {
                                base64: base64Image,
                            },
                        },
                    },
                ],
            }),
        });

        const result = await response.json();
        const concepts: any[] = result.outputs?.[0]?.data?.concepts ?? [];

        const foundCoffee = concepts.some((concept) =>
            KEY_WORDS.some((keyword) => concept.name.toLowerCase().includes(keyword))
        );

        if (foundCoffee) {
            console.log('Coffee detected!');
        } else {
            console.log('No coffee detected.');
        }

        return foundCoffee;
    } catch (err) {
        console.error('Clarifai error:', err);
        return false;
    }
}
