# MuseTrip360 Project Overview

## Purpose

MuseTrip360 is a comprehensive digital platform for historical museums that enables virtual exhibitions, 3D artifact viewing, and intelligent visitor interactions. It's a multi-tenant platform supporting multiple museums with shared infrastructure.

## Key Applications

- **visitor-portal** (Next.js 15): Public-facing website for museum visitors
- **museum-portal** (Vite + React): Museum staff management application
- **admin-portal** (Vite + React): System administration interface
- **mobile** (React Native + Expo): Mobile visitor experience with AR/VR

## Backend

- ASP.NET Core 8 API (deployed separately)
- Full OpenAPI 3.0 documentation available at `./swagger.json`
- PostgreSQL, Redis, Vector databases (Qdrant, pgvector, MongoDB)
- AI integration with LLMs (deepseek-r1, llama, gemma3)

## Current Branch Status

Working on **packages/rich-editor** branch with active development on rich text editor functionality for museum content management.
