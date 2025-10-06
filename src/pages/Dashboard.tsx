import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Code, CreditCard, Settings, LogOut, Mail, Phone, Download } from "lucide-react";
import logo from "@/assets/kultrip-logo.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Lead {
  id: string;
  traveler_name: string;
  traveler_email: string;
  traveler_phone: string | null;
  story_theme: string;
  destination: string | null;
  guide_generated_at: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLeads();
    }
  }, [userId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUserId(user.id);
  };

  const fetchLeads = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("agency_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load leads");
      console.error(error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };
  
  const agencyId = userId || "demo-agency-123";
  const widgetCode = `<script src="https://kultrip.com/widget.js" data-agency-id="${agencyId}"></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    toast.success("Widget code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/landing");
  };

  const handleContactEmail = (email: string, name: string) => {
    window.location.href = `mailto:${email}?subject=Your Kultrip Travel Guide&body=Hi ${name},%0D%0A%0D%0AThank you for using our Kultrip service...`;
    toast.success("Opening email client...");
  };

  const handleContactPhone = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    toast.success("Opening WhatsApp...");
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Theme", "Destination", "Status", "Generated At"];
    const rows = leads.map(lead => [
      lead.traveler_name,
      lead.traveler_email,
      lead.traveler_phone || "N/A",
      lead.story_theme,
      lead.destination || "N/A",
      lead.status,
      new Date(lead.guide_generated_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kultrip-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Leads exported successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Kultrip" className="h-10 w-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kultrip
            </span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Agency Dashboard</h1>
          <p className="text-muted-foreground">Manage your Kultrip integration</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="widget">
              <Code className="w-4 h-4 mr-2" />
              Widget
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Guides</div>
                <div className="text-3xl font-bold">{leads.length}</div>
                <div className="text-xs text-muted-foreground mt-1">All time</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Leads Generated</div>
                <div className="text-3xl font-bold">{leads.length}</div>
                <div className="text-xs text-muted-foreground mt-1">All time</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Current Plan</div>
                <div className="text-2xl font-bold">Free</div>
                <Button variant="link" className="p-0 h-auto mt-2" onClick={() => {}}>
                  Upgrade
                </Button>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Leads</h2>
                <Button variant="outline" size="sm" onClick={exportToCSV} disabled={leads.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading leads...</p>
              ) : leads.length === 0 ? (
                <div>
                  <p className="text-muted-foreground mb-4">
                    No leads yet. Install the widget on your website to start receiving leads!
                  </p>
                  <Button variant="hero" onClick={() => document.querySelector('[value="widget"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                    Install Widget
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Traveler</TableHead>
                        <TableHead>Theme</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.slice(0, 10).map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.traveler_name}</TableCell>
                          <TableCell>{lead.story_theme}</TableCell>
                          <TableCell>{lead.destination || "N/A"}</TableCell>
                          <TableCell>{new Date(lead.guide_generated_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleContactEmail(lead.traveler_email, lead.traveler_name)}
                                title="Send email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                              {lead.traveler_phone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleContactPhone(lead.traveler_phone!)}
                                  title="WhatsApp"
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="widget" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Widget Code</h2>
              <p className="text-muted-foreground mb-6">
                Copy and paste this code before the closing{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">&lt;/body&gt;</code> tag on
                your website.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-4 relative">
                <code className="text-sm break-all">{widgetCode}</code>
                <Button
                  size="sm"
                  variant={copied ? "secondary" : "outline"}
                  className="absolute top-3 right-3"
                  onClick={handleCopyCode}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Installation Steps:</h3>
                <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Copy the widget code above</li>
                  <li>
                    Open your website's HTML file or template editor
                  </li>
                  <li>
                    Paste the code before the closing{" "}
                    <code className="bg-muted px-1 rounded text-xs">&lt;/body&gt;</code> tag
                  </li>
                  <li>Save and publish your changes</li>
                  <li>The Kultrip widget will appear on your site automatically</li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">💡</span> Widget Preview
                </h4>
                <p className="text-sm text-muted-foreground">
                  The widget will appear as a floating button on your website. When clicked,
                  travelers can choose a story theme and generate their personalized travel guide.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription & Billing</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Current Plan</div>
                  <div className="text-2xl font-bold mb-4">Free (Pay-per-lead)</div>
                  <p className="text-muted-foreground text-sm mb-4">
                    You're currently on the pay-per-lead model at €5 per lead.
                  </p>
                  <Button variant="hero">Upgrade to Basic (€49/mo)</Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Available Plans</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 border-2">
                      <div className="font-semibold mb-2">Pay-per-Lead</div>
                      <div className="text-2xl font-bold mb-2">€5/lead</div>
                      <div className="text-xs text-muted-foreground">Current plan</div>
                    </Card>
                    <Card className="p-4 border-2 border-primary">
                      <div className="font-semibold mb-2">Basic</div>
                      <div className="text-2xl font-bold mb-2">€49/mo</div>
                      <div className="text-xs text-muted-foreground">+ €2 per lead</div>
                    </Card>
                    <Card className="p-4 border-2">
                      <div className="font-semibold mb-2">Premium</div>
                      <div className="text-2xl font-bold mb-2">€149/mo</div>
                      <div className="text-xs text-muted-foreground">+ €1 per lead</div>
                    </Card>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  * Pricing and limits may change in the future
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Agency Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Agency Name</label>
                  <Input placeholder="Your Travel Agency" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Website</label>
                  <Input placeholder="https://youragency.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Language</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option>English 🇬🇧</option>
                    <option>Spanish 🇪🇸</option>
                    <option>Portuguese 🇧🇷</option>
                  </select>
                </div>
                <Button variant="hero">Save Changes</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
