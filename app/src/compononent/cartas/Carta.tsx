import React from "react";
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
            <ImagenFrente $volteada={carta.volteada} src={carta.imagenFrente} alt="carta-frente" />
            <ImagenReverso $volteada={carta.volteada} src={carta.imagenReverso} alt="carta-reverso" />
        </Wrapper>
    );
}

export default Carta;