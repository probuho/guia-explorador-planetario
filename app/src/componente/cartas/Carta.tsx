import React from "react";
import LazyLoad from 'react-lazyload';
//Tipos
import TipoCarta from "../interfaces/TipoCarta";
import { Wrapper, ImagenFrente, ImagenReverso } from "./Carta.styles";


type Props = {
    carta: TipoCarta;
    callback: (carta: TipoCarta) => void;
}

const Carta: React.FC<Props> = ({carta, callback}) => {
    const handleClick = () => {
        if(carta.clickable) callback(carta);
    };
    
    return (
        <Wrapper onClick={handleClick}>
            <LazyLoad height={150} once>
            <ImagenFrente $volteada={carta.volteada} src={carta.imagenFrente} alt="carta-frente" />
            </LazyLoad>
            <LazyLoad height={150} once>
            <ImagenReverso $volteada={carta.volteada} src={carta.imagenReverso} alt="carta-reverso" />
            </LazyLoad>
        </Wrapper>
    );
}

export default Carta;