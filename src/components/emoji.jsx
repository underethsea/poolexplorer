
    import React from 'react'
    
    const emoji = (amount) => {
        let emojiIcon = "";
        if(amount > 500) 
            {emojiIcon = "whale"} else
        if(amount < 1)
            {emojiIcon = "crying"} else
        if(amount < 10)
            {emojiIcon = "eek"} else
            {emojiIcon = "bank"}

        return emojiIcon;
    
        
    }
    
    export default emoji
    