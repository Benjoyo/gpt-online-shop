import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/userService";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import OrderHistory from "../Order/OrderHistory";
import { Box } from "@mui/material";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<{
    id: number;
    username: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          margin: "0 auto",
          marginTop: 3,
          maxWidth: "750px",
          padding: 2,
        }}
      >
        {profile && (
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {profile.username}
              </Typography>
              <Typography color="text.secondary">ID: {profile.id}</Typography>
              <Typography color="text.secondary">Email: {profile.email}</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      <OrderHistory />
    </>
  );
};

export default Profile;
