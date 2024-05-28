import React from 'react'
import { Button } from 'react-bootstrap'

const RoundButton = ({ text, variant = "primary", textColor = "text-white", newclass = "" }) => {
    let allclass = `rounded-pill ${textColor} ` + newclass
    return (
        <Button variant={variant} size="lg" className={`${allclass}`} >
            {text}
        </Button>
    )
}

export default RoundButton