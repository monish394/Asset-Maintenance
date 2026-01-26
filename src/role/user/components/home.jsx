
import Carousel from "./Carousel";
import { useUserAsset } from "../context/userassetprovider";



export default function UserHome() {
  const token=localStorage.getItem("token")
  console.log(token)
  const { myasset} = useUserAsset();
 console.log("User assets in Home:", myasset);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>User Home Page</h1>

      <Carousel />
     <div className="mt-10 ">
  <h1 className="text-2xl font-semibold mb-4 text-gray-700">
    My Assigned Assets
  </h1>

  <div className="overflow-x-auto">
    <table className=" min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Asset Image
          </th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Asset Name
          </th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Description
          </th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Category
          </th>
        </tr>
      </thead>

      <tbody>
        {myasset.length > 0 ? (
          myasset.map((ele) => (
            <tr
              key={ele._id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2">
                <img
                  src={ele.assetImg}
                  alt={ele.assetName}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              </td>

              <td className="px-4 py-2 text-sm font-medium text-gray-700">
                {ele.assetName}
              </td>

              <td className="px-4 py-2 text-sm text-gray-600">
                {ele.description}
              </td>

              <td className="px-4 py-2">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                  {ele.category}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="4"
              className="px-4 py-6 text-center text-gray-500"
            >
              No assets assigned
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      <section style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Quick Stats Overview</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: "rgb(211, 211, 211)",
                height: "190px",
                width: "calc(25% - 15px)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
                color: "#333",
              }}
            >
              Stat {item}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Recent Work Orders</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              Work Order #{item}
            </div>
          ))}
        </div>
      </section>

    
      <section style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Technician Info Panel</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              Technician #{item} Info
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
