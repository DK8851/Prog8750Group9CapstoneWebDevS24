import React from 'react'
import { Button } from 'react-bootstrap'

const RoundButton = ({ text, variant = "primary", textColor = "text-white", newclass = "", size = "lg" }) => {
    let allclass = `rounded-pill ${textColor} ` + newclass
    return (
        <Button type='submit' variant={variant} size={size} className={`${allclass}`} >
            {text}
        </Button>
    )
}

export default RoundButton