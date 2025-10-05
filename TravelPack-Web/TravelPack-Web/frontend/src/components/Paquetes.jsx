import React, { useEffect, useState } from "react";
import { getPaquetes } from "../services/api";

function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);

  useEffect(() => {
    getPaquetes().then((data) => setPaquetes(data));
  }, []);

  return (
    <div className="row mt-4">
      {paquetes.map((p) => (
        <div key={p.ID_Paquete} className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{p.Nombre}</h5>
              <p>{p.Descripcion}</p>
              <p><b>Precio:</b> ${p.Precio}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Paquetes;
