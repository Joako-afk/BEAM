// src/controllers/usuariocontroller.js
import bcrypt from "bcrypt";
import { crearUsuario } from "../models/usuarioModel.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await crearUsuario(nombre, email, passwordHash);

    res.status(201).json({
      message: "Usuario creado con éxito",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
