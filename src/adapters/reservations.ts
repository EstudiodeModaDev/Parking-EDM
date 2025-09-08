export type ReservationUI = {
  Id: number;
  Date: string;
  Turn: string;
  SpotId: number;
  Spot: string;
  VehicleType: string;
  Status: string;
  User: string
};

export const mapReservationToUI = (r: any): ReservationUI => {
  const dateStr = String(r.Date ?? r.date ?? r.Fecha ?? r.fecha ?? '').slice(0, 10);

  const spotId = Number(
    r['SpotId#Id'] ??
    r.SpotId?.Id ??
    r.SpotId ??
    0
  );

  const spotTitle = String(
    r.SpotId?.Value      // si el lookup “muestra” Title, aquí vendrá el texto visible
    ?? r['SpotId/Title'] // fallback si usas $expand
    ?? r.Spot            // algún aplanado
    ?? (spotId ? String(spotId) : '')
  );



  return {
    Id: Number(r.ID ?? r.Id ?? r.id ?? 0),
    Date: /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : '',
    Turn: String(r.Turn ?? r.Turno ?? r.turn ?? ''),
    SpotId: spotId,
    Spot: spotTitle,
    VehicleType: String(r.VehicleType ?? r.Vehiculo ?? r.vehicleType ?? ''),
    Status: String(r.Status ?? r.Estado ?? r.status ?? ''),
    User: String(r.NombreUsuario)
  };
};
