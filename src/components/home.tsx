import { browser } from '@tensorflow/tfjs';
import { load, MobileNet } from '@tensorflow-models/mobilenet';
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

interface ImageData {
    height: number;
    width: number;
    imageElement: HTMLImageElement;
}

const Container = styled.div`
    font-family: 'Roboto', sans-serif;
    background-color: #f3d8a6;
    color: #e25415;
    height: 100%;
    padding: 30px;
    overflow: auto;
`;

const Logo = styled.div`
    font-size: 10vw;
    text-align: center;
`;

const UploadArea = styled.div`
    padding: 20px;
    font-size: 3vw;
    display: flex;
    flex-direction: column;
    align-items: center;

    div {
        margin: 10px 0;
    }
`;

const Upload = styled.label`
    color: #fefefe;
    background-color: #d06528;
    padding: 10px;
    border-radius: 20px;
    input {
        display: none;
    }
`;

const ImageContainer = styled.div`
    justify-content: center;
    margin: 10px 0;
    display: flex;
`;

const Image = styled.img`
    width: 70%;
`;

const IsPizzaResult = styled.div<{
    result: boolean;
}>`
    margin: 10px 0;
    height: 50px;
    color: #fefefe;
    background-color: ${({ result }) => (result ? '#11760f' : '#b60708')};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3vw;
`;

const getImageData = (imageUrl: string): Promise<ImageData> => {
    const imageElement = document.createElement('img');
    return new Promise((res) => {
        imageElement.onload = function () {
            const { height, width } = imageElement;
            res({ height, width, imageElement });
        };
        imageElement.src = imageUrl;
    });
};

export const Home: FunctionComponent<{}> = () => {
    const [image, setImage] = useState<string | null>('');
    const [isPizza, setIsPizza] = useState<boolean | null>(null);
    const [mobilenetModel, setMobilenetModel] = useState<MobileNet | null>(
        null,
    );

    useEffect(() => {
        (async () => {
            setMobilenetModel(await load());
        })();
    }, []);

    const handleImageUpload = async ({
        target: { files },
    }: React.ChangeEvent<HTMLInputElement>) => {
        if (!mobilenetModel || !files || !files.length) {
            return;
        }
        setIsPizza(null);
        const imageUrl = URL.createObjectURL(files[0]);
        setImage(imageUrl);
        const { imageElement } = await getImageData(imageUrl);
        const tensor = browser.fromPixels(imageElement);
        const predictions = await mobilenetModel.classify(tensor);
        const classes = predictions.map(({ className }) => className);
        const isPizzaResult =
            classes.join('').toLowerCase().indexOf('pizza') !== -1;
        setIsPizza(isPizzaResult);
    };

    return (
        <Container>
            <Logo>Not Pizza</Logo>
            <UploadArea>
                <div>{"Not sure if it's a pizza?"}</div>
                <Upload>
                    Upload a photo!
                    <input
                        type="file"
                        name="file"
                        onChange={handleImageUpload}
                    />
                </Upload>
            </UploadArea>
            {isPizza !== null && (
                <IsPizzaResult result={isPizza}>
                    {isPizza ? 'pizza' : 'not a pizza'}
                </IsPizzaResult>
            )}
            <ImageContainer>{image && <Image src={image} />}</ImageContainer>
        </Container>
    );
};
