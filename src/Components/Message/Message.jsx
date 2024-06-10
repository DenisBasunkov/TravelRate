import { Message } from "rsuite"


export const MyMessage = ({ type, text }) => {

    return <Message showIcon type={type}>
        <h4>{text}</h4>
    </Message>

}