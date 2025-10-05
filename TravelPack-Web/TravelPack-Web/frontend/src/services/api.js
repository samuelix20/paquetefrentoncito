export async function getPaquetes() {
  const response = await fetch("http://localhost:4000/api/paquetes");
  return await response.json();
}
