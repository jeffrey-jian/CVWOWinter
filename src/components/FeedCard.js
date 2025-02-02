import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import CommentNew from "./CommentNew";
import PostModal from "./PostModal";
import CommentsList from "./CommentsList";
import { Stack } from "@mui/system";
import { useRemovePostMutation } from "../store";
import LikeButton from "./LikeButton";

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function FeedCard({ item, user }) {
  const [expanded, setExpanded] = useState(false);
  const [isActionShown, setIsActionShown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [removePost, removePostResults] = useRemovePostMutation();

  const id = item.id;
  const author_id = item.author_id;
  const author_username = item.author_username;
  const author_avatarColor = item.author_avatarColor;
  const initial = author_username.slice(0, 1);
  const date_created = item.date_created;
  const title = item.title;
  const text = item.post_text;
  const category = item.category;

    // date in UTC time, +8 hours SG time
    dayjs.extend(relativeTime);
    const formatted_date = date_created ? dayjs(date_created).add(8, 'hour').fromNow() : null;

  const expandClickHandler = () => {
    setExpanded(!expanded);
  };
  const mouseEnterHandler = () => {
    setIsActionShown(true);
  };
  const mouseLeaveHandler = () => {
    setIsActionShown(false);
  };
  const onEditHandler = () => {
    setIsModalOpen(true);
  };
  const onDeleteHandler = () => {
    removePost(item);
  };

  const sideActions =
    user.id === author_id ? (
      <Stack sx={{ visibility: isActionShown ? "visible" : "hidden" }}>
        <Tooltip title="Edit Post" placement="right">
          <IconButton onClick={onEditHandler}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Post" placement="right">
        <IconButton onClick={onDeleteHandler}>
          {removePostResults.isLoading ? <CircularProgress /> : <DeleteIcon />}
        </IconButton>
        </Tooltip>
      </Stack>
    ) : null;

  return (
    <>
      <PostModal
        type="edit"
        originalPost={item}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Card
        sx={{ margin: 5 }}
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: author_avatarColor }}>{initial}</Avatar>
          }
          title={author_username}
          subheader={category + "\t — " + formatted_date}
          action={sideActions}
        />
        <CardContent>
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {text}
          </Typography>
        </CardContent>
        <CardActions>
          <LikeButton post={item} user={user} />

          <ExpandMore expand={expanded} onClick={expandClickHandler}>
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: grey[100] }}
        >
          <List sx={{ margin: "0 5px" }}>
            <CommentsList post_id={id} user={user} />
            <CommentNew post_id={id} user={user} />
          </List>
        </Collapse>
      </Card>
    </>
  );
}

export default FeedCard;
