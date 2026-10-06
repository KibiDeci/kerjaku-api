import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import ExploreContainer from "../components/ExploreContainer"
import "./Tab1.css"
import { NavLink } from "react-router-dom"

const NotFound = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Not Found</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div>Click to Enter Home</div>
        <NavLink to="/home">Home</NavLink>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">404</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="404" />
      </IonContent>
    </IonPage>
  )
}

export default NotFound
