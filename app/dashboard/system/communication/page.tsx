import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Server } from "lucide-react"

export default function CommunicationServerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Communication Server Settings</h1>
          <p className="text-muted-foreground">Configure settings for the communication server.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Server Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-ip">Server IP Address</Label>
                <Input id="server-ip" defaultValue="192.168.1.100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-port">Port Number</Label>
                <Input id="server-port" type="number" defaultValue="8080" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartbeat-interval">Heartbeat Interval (seconds)</Label>
                <Input id="heartbeat-interval" type="number" defaultValue="60" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SSL/TLS</Label>
                  <p className="text-sm text-muted-foreground">Encrypt communication with SSL/TLS.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Reconnect</Label>
                  <p className="text-sm text-muted-foreground">Automatically attempt to reconnect on disconnection.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Logging Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <Button>Save Configuration</Button>
            <Button variant="outline">Test Connection</Button>
            <Button variant="destructive">Restart Server</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
