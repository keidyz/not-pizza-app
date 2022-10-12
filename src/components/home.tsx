import { browser } from '@tensorflow/tfjs';
import { load, MobileNet } from '@tensorflow-models/mobilenet';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Particles from 'react-tsparticles';
import styled from 'styled-components';
import { loadFull } from 'tsparticles';

import pizzaIcon from '../images/pizza-icon.png';

interface ImageData {
    height: number;
    width: number;
    imageElement: HTMLImageElement;
}

const Container = styled.div`
    font-family: 'Roboto', sans-serif;
    background-image: linear-gradient(to bottom left, #fcca6d, #fce5bb);
    color: #e25415;
    height: 100%;
    padding: 30px;
    overflow: auto;
`;

const Logo = styled.div`
    font-size: 13vw;
    text-align: center;
    margin: 10px;
`;

const UploadArea = styled.div`
    padding: 20px;
    font-size: 4vw;
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
    result: string;
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

const Foreground = styled.div`
    position: relative;
`;

const particleConfig = {
    emitters: [
        {
            life: {
                delay: 0.1,
                duration: 0.5,
            },
            rate: {
                delay: 0.5,
                quantity: 1,
            },
            position: {
                y: 50,
            },
            direction: 'bottom',
        },
        {
            life: {
                delay: 0.2,
                duration: 0.5,
            },
            rate: {
                delay: 0.5,
                quantity: 1,
            },
            position: {
                y: 50,
            },
            direction: 'bottom',
        },
    ],
    particles: {
        shape: {
            type: 'image',
            options: {
                image: [
                    {
                        src: pizzaIcon,
                    },
                ],
            },
        },
        rotate: {
            value: {
                min: 0,
                max: 360,
            },
            direction: 'random',
            animation: {
                enable: true,
                speed: 2,
            },
        },
        number: {
            value: 0,
        },
        size: {
            value: 50,
        },
        move: {
            enable: true,
            direction: 'none',
            straight: true,
            out_mode: 'destroy',
            speed: {
                min: 2,
                max: 5,
            },
        },
    },
};

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

    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
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
        console.log('qwe', predictions)
        const classes = predictions.map(({ className }) => className);
        const isPizzaResult =
            classes.join('').toLowerCase().indexOf('pizza') !== -1;
        setIsPizza(isPizzaResult);
    };

    return (
        <Container>
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particleConfig}
            />
            <Foreground>
                <iframe
                    src="https://ghbtns.com/github-btn.html?user=keidyz&repo=not-pizza-app&type=star&size=large"
                    frameBorder="0"
                    scrolling="0"
                    width="170"
                    height="30"
                    title="GitHub"
                ></iframe>
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
                    <IsPizzaResult result={String(isPizza)}>
                        {isPizza ? 'pizza' : 'not a pizza'}
                    </IsPizzaResult>
                )}
                <ImageContainer>
                    {image && <Image src={image} />}
                </ImageContainer>
            </Foreground>
        </Container>
    );
};
