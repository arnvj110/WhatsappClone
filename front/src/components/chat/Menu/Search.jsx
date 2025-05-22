import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, styled, InputBase } from '@mui/material';


const Container = styled(Box)`
    background: #fff;
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 13px;
    
`;

const InputDiv = styled(InputBase)`
    width: 85%;
    border: none;
    outline: none;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;

    & input {
        color: #000;
        font-size: 15px;
    }

    & input::placeholder {
        color: #667781;
        opacity: 1;
        font-weight: 400;
        font-size: 15px;
    }
`;


const SearchIconDiv = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isFocused'
})`
    
    display: flex;
    background: ${props => props.isFocused ? '#fff' : '#F6F6F6'};
    width: 100%;
    height: 43px;
    border-radius: 50px;
    align-items: center;
    padding: 0 10px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50px;
        border: ${props => props.isFocused ? '2.5px solid #28b463' : '1.5px solid transparent'};
        pointer-events: none;
        box-sizing: border-box;
    }

    ${props => !props.isFocused && `
        &:hover::after {
            border: 1.5px solid #667781;
        }
    `}
`;

const Search = ({placeholder, autoFocus, setValue}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Container>
            <SearchIconDiv isFocused={isFocused}>
                <SearchIcon 
                    sx={{ color: '#7a7a7a', fontSize: 18, marginRight: 1 }} 
                />
                <InputDiv 
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    
                    onChange={(e)=>{setValue(e.target.value)}}
                />
            </SearchIconDiv>
        </Container>
    );
};

export default Search;
