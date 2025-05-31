# Cursor AI Development Guide - Ghana Bus Booking App

This guide helps you effectively use Cursor AI to develop and enhance the Ghana Bus Booking app.

## 🎯 Quick Start Commands

### Setup Commands
\`\`\`bash
# Initial setup
npm run cursor:setup

# Clean install (if issues)
npm run cursor:clean

# Check environment variables
npm run cursor:env-check
\`\`\`

### Development Commands
\`\`\`bash
# Start with cache clear
npm run dev

# Platform-specific development
npm run dev:android
npm run dev:ios
\`\`\`

## 🤖 Effective Cursor AI Prompts

### Feature Development
\`\`\`
"Add a new feature to [specific component] that allows users to [specific functionality]. Make sure to include proper TypeScript types, error handling, and follow the existing code patterns."
\`\`\`

### Bug Fixes
\`\`\`
"Fix the issue in [component/file] where [describe the problem]. The error occurs when [specific scenario]. Please maintain the existing functionality and add proper error handling."
\`\`\`

### Code Optimization
\`\`\`
"Optimize the performance of [component/function] by [specific optimization technique]. Ensure backward compatibility and add comments explaining the changes."
\`\`\`

### Testing
\`\`\`
"Create comprehensive tests for [component/function] including edge cases, error scenarios, and happy path testing. Use the existing testing patterns in the project."
\`\`\`

## 📁 Key Files for AI Context

### Core Configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration
- `types/index.ts` - Type definitions

### Main Application Files
- `App.tsx` - Main app component
- `lib/supabase.ts` - Database configuration
- `context/` - State management
- `utils/` - Utility functions

### Development Helpers
- `utils/dev-helpers.ts` - Development utilities
- `utils/error-handler.ts` - Error handling
- `components/test/` - Test components

## 🔧 Common Development Tasks

### Adding a New Screen
1. Create screen file in `screens/`
2. Add navigation types to `types/index.ts`
3. Update navigation configuration in `App.tsx`
4. Add any required context or utilities

### Adding a New Component
1. Create component in appropriate `components/` subdirectory
2. Add TypeScript interfaces
3. Include proper error handling
4. Add to exports if reusable

### Database Changes
1. Create migration in `supabase/migrations/`
2. Update type definitions in `types/index.ts`
3. Update Supabase helpers in `utils/`
4. Test with development data

### Adding Notifications
1. Update notification types in `types/index.ts`
2. Add notification handlers in `utils/notifications.ts`
3. Update Edge Function if needed
4. Test on real device

## 🎨 Code Style Guidelines

### TypeScript
- Use strict typing
- Define interfaces for all data structures
- Use proper generic types
- Include JSDoc comments for complex functions

### React Native
- Use functional components with hooks
- Implement proper error boundaries
- Use StyleSheet for styling
- Follow React Native best practices

### File Organization
- Group related files in directories
- Use descriptive file names
- Keep components focused and single-purpose
- Separate business logic from UI components

## 🐛 Debugging Tips

### Common Issues
1. **Environment Variables**: Use `npm run cursor:env-check`
2. **Cache Issues**: Use `npm run dev` (includes --clear)
3. **Type Errors**: Check `types/index.ts` for missing definitions
4. **Navigation Issues**: Verify types in navigation param lists

### Development Tools
- Use test components in `components/test/`
- Check console logs with `devLog()` function
- Use error handler for consistent error management
- Test on real devices for notifications

## 📚 AI Learning Resources

### Project Context
- Read `README.md` for project overview
- Check `types/index.ts` for data structures
- Review `utils/` for helper functions
- Examine existing components for patterns

### Best Practices
- Follow existing code patterns
- Use TypeScript strictly
- Include proper error handling
- Add meaningful comments
- Test on multiple platforms

## 🚀 Deployment Preparation

### Pre-deployment Checklist
- [ ] Remove test components
- [ ] Update environment variables for production
- [ ] Test on real devices
- [ ] Verify all features work offline
- [ ] Check performance on older devices
- [ ] Update version numbers
- [ ] Create production build

### Build Commands
\`\`\`bash
# Development build
npm run build:dev

# Production build
npm run build:prod
\`\`\`

## 💡 Pro Tips for Cursor AI

1. **Be Specific**: Provide exact file names and line numbers when possible
2. **Include Context**: Reference existing patterns and conventions
3. **Test Incrementally**: Make small changes and test frequently
4. **Use Types**: Leverage TypeScript for better AI understanding
5. **Document Changes**: Add comments explaining complex logic

## 🔗 Useful Commands

\`\`\`bash
# Check TypeScript errors
npm run type-check

# Lint code
npm run lint

# View Expo config
npx expo config

# Clear Expo cache
npx expo start --clear

# Install dependencies
npx expo install <package-name>
\`\`\`

This guide should help you work more effectively with Cursor AI on this React Native project!
