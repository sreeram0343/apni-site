# Supabase MCP & Agent Skills Integration Guide

This document outlines the setup, authentication, and integration of **Supabase Model Context Protocol (MCP)** and **Agent Skills** in the **ApniSite** development environment.

This integration equips the AI coding tools to inspect and interact directly with your Supabase database schema, structure, tables, and Postgres rules.

---

## 1. Supabase MCP Client Configuration

The Supabase MCP server is configured globally and within the workspace.

### Configuration Locations
1. **Global Configuration:** `C:\Users\Thinkpad\.gemini\antigravity-cli\mcp_config.json`
2. **Workspace Configuration:** `C:\Users\Thinkpad\Desktop\projects\apni-site\.agents\mcp_config.json`

Both files have been updated with the following definition:

```json
{
  "mcpServers": {
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp?project_ref=uxallvslvekghkwstidk"
    }
  }
}
```

---

## 2. Authentication Flow

After saving the configuration:
1. **OAuth Flow Initialization:** Restart Antigravity/your AI client. It will automatically detect the new `supabase` configuration and prompt you to complete the OAuth flow in your web browser.
2. **Interactive Configuration:** 
   * Click the **Manage MCP Servers** panel in your AI panel.
   * If you run into authorization issues or need to re-authenticate, open **Agent Settings** using `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac), navigate to the **Customizations** tab, and click the **Authenticate** button next to the `supabase` server.

---

## 3. Supabase Agent Skills

Agent Skills have been installed to provide the AI assistant with standard instructions, schemas, and best practices for writing efficient queries and managing Supabase.

### Installation Command Run
```bash
npx skills add supabase/agent-skills
```

### Installed Skills List
1. **Postgres Best Practices**
   * Located at: `~\Desktop\projects\apni-site\.agents\skills\supabase-postgres-best-practices`
   * Purpose: Guides the AI on writing clean SQL queries, optimal indexes, partition schemes, and secure database parameters.
2. **Supabase Core**
   * Located at: `~\Desktop\projects\apni-site\.agents\skills\supabase`
   * Purpose: Optimizes interactions with Supabase Client SDK, Row Level Security (RLS) policies, storage buckets, and serverless Edge functions.
