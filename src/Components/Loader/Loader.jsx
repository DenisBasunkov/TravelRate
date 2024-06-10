import { PropagateLoader } from "react-spinners"
import styles from "./Loader.module.scss"

export const Loadered = () => {

    return <div className={styles.block}>

        <PropagateLoader
            size={20}
            color="#5AB2FF"
            speedMultiplier={.4}
            cssOverride={{
                marginBottom: "50px",
                marginLeft: "100px"
            }}
        />

    </div>

}