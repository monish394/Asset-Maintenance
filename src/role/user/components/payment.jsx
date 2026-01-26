import { useUserAsset } from "../context/userassetprovider";

export default function Payment() {
    const { myasset} = useUserAsset();
 console.log("User assets Payments:", myasset);
    return(
        <div>
            <h1>Payment page</h1>
        </div>
    )
    
}