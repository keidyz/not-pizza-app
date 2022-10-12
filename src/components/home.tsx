import { browser } from '@tensorflow/tfjs';
import { load, MobileNet } from '@tensorflow-models/mobilenet';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import Particles from 'react-tsparticles';
import styled from 'styled-components';
import { loadFull } from 'tsparticles';

import { phone, tablet } from '../constants/screen-sizes';
import pizzaIcon from '../images/pizza-icon.png';
import { GitHubButton } from './github-button';

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
    @media only screen and (max-width: ${phone}) {
        padding: 10px;
    }
`;

const Logo = styled.div`
    font-size: 10vw;
    text-align: center;
    margin: 10px;
    @media only screen and (max-width: ${tablet}) {
        font-size: 14vw;
    }
    @media only screen and (max-width: ${phone}) {
        font-size: 19vw;
    }
`;

const UploadArea = styled.div`
    font-size: 3vw;
    display: flex;
    flex-direction: column;
    align-items: center;

    div {
        margin: 10px 0;
    }

    @media only screen and (max-width: ${tablet}) {
        font-size: 5vw;
    }

    @media only screen and (max-width: ${phone}) {
        font-size: 7vw;
    }
`;

const Upload = styled.label`
    color: #fefefe;
    background-color: #d06528;
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
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
    width: 50%;
`;

const IsPizzaResult = styled.div<{
    result: string;
}>`
    margin: 10px 0;
    height: 50px;
    color: #fefefe;
    background-color: ${({ result }) =>
        result === 'true' ? '#11760f' : '#b60708'};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3vw;
    @media only screen and (max-width: ${tablet}) {
        margin: 30px 0;
        font-size: 4vw;
    }
    @media only screen and (max-width: ${phone}) {
        font-size: 6vw;
    }
`;

const Foreground = styled.div`
    position: relative;
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
    const isPhone = useMediaQuery({ query: `(max-width: ${phone})` });

    useEffect(() => {
        (async () => {
            setMobilenetModel(await load());
        })();
    }, []);

    const particlesInit = useCallback(async (engine) => {
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
        const classes = predictions.map(({ className }) => className);
        const isPizzaResult =
            classes.join('').toLowerCase().indexOf('pizza') !== -1;
        setIsPizza(isPizzaResult);
    };

    const particleConfig = {
        fpsLimit: 30,
        emitters: [
            {
                life: {
                    delay: isPhone ? 2.5 : 0.1,
                    duration: 0.5,
                },
                rate: {
                    delay: 0.5,
                    quantity: 1,
                },
                position: {
                    y: isPhone ? 30 : 50,
                },
                direction: 'bottom',
            },
            {
                life: {
                    delay: isPhone ? 3.5 : 0.2,
                    duration: 0.5,
                },
                rate: {
                    delay: 0.5,
                    quantity: 1,
                },
                position: {
                    y: isPhone ? 30 : 50,
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

    return (
        <Container>
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particleConfig}
            />
            <Foreground>
                <GitHubButton width={isPhone ? '75' : '75'} />
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
