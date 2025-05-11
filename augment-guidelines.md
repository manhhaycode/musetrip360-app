# Augment Chat Guidelines for MuseTrip360 Project

## Purpose

These guidelines instruct Augment Chat to consistently follow the MuseTrip360 MDC rule file located at `.cursor/rules/musetrip360-rule.mdc`. Adherence to these guidelines ensures all code generation, recommendations, and assistance align with the project's established standards and architecture.

## Rule Access and Reference

1. **Rule Location**: Always reference the MDC rule file at `.cursor/rules/musetrip360-rule.mdc` when providing assistance.
2. **Rule Priority**: The MDC rules take precedence over general best practices when there's a conflict.
3. **Rule Updates**: Check for updates to the rule file before providing significant assistance to ensure recommendations reflect the latest standards.

## Technology Stack Compliance

1. **Backend Development**:

   - Always use ASP.NET Core 8 for backend solutions
   - Ensure all APIs follow RESTful principles
   - Implement JWT for authentication and authorization
   - Use Entity Framework Core for PostgreSQL database interactions
   - Include robust error handling in all backend code

2. **Frontend Development**:

   - Use ReactJS/NextJS for web frontend development
   - Implement Redux or Context API for state management
   - Use Three.js for 3D content and immersive experiences
   - Ensure responsive design across all devices
   - Support both Vietnamese and English languages

3. **Mobile Development**:

   - Use React Native for mobile application development
   - Maintain consistency with the web application
   - Consider offline capabilities where appropriate

4. **Database Usage**:

   - Use PostgreSQL for relational data
   - Implement Redis for caching
   - Utilize vector databases (Qdrant, pgvector, MongoDB) for advanced queries

5. **AI Integration**:
   - Integrate Large Language Models (deepseek-r1, llama, gemma3)
   - Implement chatbot functionality for recommendations, Q&A, and guidance
   - Ensure natural language understanding for museum-specific queries
   - Use museum-specific terminology for training data

## Code Quality Standards

1. **Naming Conventions**:

   - Use meaningful, descriptive names for variables, functions, and classes
   - Follow consistent casing conventions (camelCase for JavaScript/TypeScript, PascalCase for C#)
   - Use domain-specific terminology from the museum context

2. **Documentation**:

   - Include comments explaining complex logic
   - Document all public APIs and interfaces
   - Provide usage examples for reusable components

3. **Error Handling**:

   - Implement comprehensive error handling
   - Log errors with appropriate context
   - Provide user-friendly error messages

4. **Security Practices**:
   - Follow secure coding practices
   - Implement proper authentication and authorization
   - Secure sensitive data, especially for payments (PCI DSS compliance)

## Feature Implementation Guidelines

1. **User Roles and Permissions**:

   - Implement Role-Based Access Control (RBAC)
   - Support different user roles (Visitor, Museum Manager, Staff, Event Organizer, Admin)
   - Ensure features respect role-specific permissions

2. **Exhibition Management**:

   - Support creation and management of digital exhibitions
   - Enable uploading and management of multimedia content (images, videos, 3D models)
   - Implement metadata management for exhibitions

3. **Ticket Booking**:

   - Support selection of exhibitions or events
   - Enable date and time selection
   - Implement secure payment processing

4. **Payment Integration**:
   - Integrate with specified payment gateways (Momo, ZaloPay, etc.)
   - Ensure secure handling of payment data
   - Follow PCI DSS guidelines

## Validation Process

Before providing final code or recommendations, validate against these criteria:

1. **Technology Alignment**: Does the solution use the specified technologies?
2. **Architectural Consistency**: Does it follow the project's architectural patterns?
3. **Feature Completeness**: Does it address all requirements for the specific feature?
4. **Security Compliance**: Does it follow security best practices and requirements?
5. **Performance Considerations**: Is it optimized for performance, especially for 3D content?
6. **Scalability**: Will it support multiple museums and a large number of users?

## Example Scenarios

When providing assistance for common scenarios, reference these examples:

1. **Creating a New Exhibition**:

   - Generate code following the exhibition entity structure
   - Include support for multimedia uploads
   - Implement exhibition metadata management

2. **Booking a Ticket**:

   - Follow the complete ticket booking flow
   - Include exhibition/event selection, date/time choice, and payment processing

3. **AI Chatbot Interaction**:
   - Reference sample dialogues from the rule file
   - Ensure responses are contextually appropriate for museum settings

## Continuous Improvement

1. **Feedback Integration**: Incorporate feedback on rule adherence to improve future assistance
2. **Rule Evolution**: Suggest potential updates to the rule file based on emerging best practices
3. **Knowledge Expansion**: Continuously expand understanding of museum-specific domain knowledge

By following these guidelines, Augment Chat will consistently provide assistance that aligns with the MuseTrip360 project standards and architecture as defined in the MDC rule file.
