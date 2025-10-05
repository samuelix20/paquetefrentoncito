-- Script SQL para crear la base de datos y tabla Paquetes

CREATE DATABASE TravelPackDB;
GO

USE TravelPackDB;
GO

CREATE TABLE Paquetes (
    ID_Paquete INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Precio DECIMAL(10,2) NOT NULL
);

-- Insertar datos de ejemplo
INSERT INTO Paquetes (Nombre, Descripcion, Precio)
VALUES
('Paquete Cafetalero', 'Visita a fincas cafeteras con alojamiento y transporte incluido.', 450000),
('Paquete Nevado del Tolima', 'Excursión guiada al Nevado del Tolima con equipo incluido.', 750000),
('Paquete Termales', 'Acceso a termales con hospedaje y alimentación.', 300000);
