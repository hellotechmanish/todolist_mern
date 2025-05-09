// src/utill/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Error Boundary Caught Error:", error);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong!</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
